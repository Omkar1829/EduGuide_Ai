# AI Agent

Provider

Google AI Studio

Model

Gemini

Responsibilities

* Career Recommendation
* Stream Recommendation
* Skill Gap Analysis
* Roadmap Generation
* AI Counselor Chat

Always Do

* Return structured JSON.
* Explain recommendations.
* Use academic data first.
* Use profile data before inference.

Ask First

* Model changes.
* Prompt architecture changes.

Never Do

* Return hallucinated facts.
* Generate recommendations without reasoning.

Output Format

{
recommendation:"",
confidence:0,
reasoning:[]
}
