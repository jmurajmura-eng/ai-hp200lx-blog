import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractJson(s) {
  if (!s) return null;
  const cleaned = s.replace(/```json/gi, "").replace(/```/g, "").trim();
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { image } = req.body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return res.status(400).json({ error: "image required" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.6",
      reasoning: { effort: "low" },
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text:
`これは学習用の4択問題です。画像内に見えている問題文と4つの選択肢を読み、正しい選択肢を1つだけ判断してください。
解説は不要です。

必ず次のJSONだけを返してください:
{
  "found": true,
  "answer": "A",
  "spoken": "A",
  "bbox": [x1,y1,x2,y2],
  "fingerprint": "問題を識別する短い文字列"
}

ルール:
- answer は画像の表記に合わせ、A/B/C/D または 1/2/3/4 のどれか。
- spoken も answer と同じ。
- bbox は「正しい選択肢の行全体」を囲む矩形。座標は画像左上を(0,0)、右下を(1000,1000)とした正規化座標。
- 4択問題が十分読めない、選択肢が4個ない、答えを判断できない場合は:
  {"found":false,"answer":"","spoken":"","bbox":[0,0,0,0],"fingerprint":""}
- JSON以外は一切出力しない。`
          },
          {
            type: "input_image",
            image_url: image,
            detail: "low"
          }
        ]
      }],
      max_output_tokens: 180
    });

    const obj = extractJson(response.output_text);
    if (!obj) return res.status(502).json({ error: "invalid model response" });

    const valid = new Set(["A","B","C","D","1","2","3","4"]);
    if (!obj.found || !valid.has(String(obj.answer))) {
      return res.json({ found:false, answer:"", spoken:"", bbox:[0,0,0,0], fingerprint:"" });
    }

    let bbox = Array.isArray(obj.bbox) && obj.bbox.length === 4 ? obj.bbox.map(Number) : [0,0,0,0];
    bbox = bbox.map(v => Math.max(0, Math.min(1000, Number.isFinite(v) ? v : 0)));

    return res.json({
      found: true,
      answer: String(obj.answer),
      spoken: String(obj.spoken || obj.answer),
      bbox,
      fingerprint: String(obj.fingerprint || "").slice(0,120)
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "analysis failed" });
  }
}
