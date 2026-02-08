# ozbargain-cli

A terminal CLI for browsing the latest deals from [Ozbargain.com.au](https://www.ozbargain.com.au).

<img width="984" height="441" alt="image" src="https://github.com/user-attachments/assets/79deac2b-4346-48f6-8108-fbaa48521f4b" />


## Features

- Browse latest deals from Ozbargain RSS feed
- Navigate with arrow keys (up/down)
- Open deals in your browser with Enter
- Colorful gradient ASCII art logo
- Discrete mode to hide the logo

## Installation

```bash
npx ozbargain-cli
```

Or install globally:

```bash
npm install -g ozbargain-cli
```

## Usage

### Normal mode (with logo)
```bash
ozbargain
# or
npx ozbargain-cli
```

### Discrete mode (no logo)
```bash
ozbargain --discrete
# or
npx ozbargain-cli --discrete
```

## Controls

| Key | Action |
|-----|--------|
| ↑ | Move up |
| ↓ | Move down |
| Enter | Open deal in browser |
| q | Quit |
| Ctrl+C | Quit |

## Screenshot

<!-- Add a screenshot here if you'd like -->

## Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ozbargain-cli.git
cd ozbargain-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
npm run start:discrete
```

## License

MIT
