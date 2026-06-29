# nventive Web Skeleton

A reusable Copilot prompt and the company standards it applies, used to
scaffold new web projects.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

This repo used to be a frozen React + Vite + MUI + Azure template. It was
never used in production and would have required ongoing maintenance to stay
current. With Copilot we replace it with two living artifacts:

- [`.github/prompts/scaffold-web-project.prompt.md`](.github/prompts/scaffold-web-project.prompt.md) —
  a reusable prompt that interviews the user and scaffolds a fresh project
  against the latest versions of the chosen stack.
- [`.github/instructions/frontend.instructions.md`](.github/instructions/frontend.instructions.md) —
  the frontend conventions (TypeScript, React, styling, i18n, …) the scaffold
  applies. Copied as-is into the generated project, then tailored to the
  chosen stack. Uses `applyTo: "frontend/**"` so it auto-activates there.

CI/CD and infrastructure principles are inlined directly in the scaffold
prompt, since they shape scaffold-time decisions rather than rules to follow
when editing files.

## How to use

In VS Code with GitHub Copilot:

1. Open this repository (or copy the two files above into the target workspace).
2. In Copilot Chat, run the slash command for the prompt
   (`/scaffold-web-project`) or attach the prompt file to a new chat.
3. Answer the interview questions. The agent will generate the project against
   the latest versions of the chosen frameworks and apply `STANDARDS.md`.

You can also install the prompt as personal, repository, or organization custom
instructions. See:

- [Personal custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-personal-instructions)
- [Repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Organization custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-organization-instructions)

## License

This project is licensed under the Apache 2.0 license — see [LICENSE](LICENSE).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for
contributing to this project.

Be mindful of our [Code of Conduct](CODE_OF_CONDUCT.md).
