#!/usr/bin/env node

/**
 * OZBARGAIN CLI - Browse latest deals from Ozbargain.com.au
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import Parser from 'rss-parser';
import { exec } from 'child_process';

const parser = new Parser();
const RSS_URL = 'https://www.ozbargain.com.au/deals/feed';

// Sunset colors gradient (from oh-my-logo)
const SUNSET_COLORS = ['#ff9966', '#ff5e62', '#ffa34e'];

// Check for --discrete flag
const isDiscrete = process.argv.includes('--discrete');

// ASCII art logo
const LOGO_ART = [
  '  ██████╗  ███████╗ ██████╗   █████╗  ██████╗   ██████╗   █████╗  ██╗ ███╗   ██╗',
  ' ██╔═══██╗ ╚══███╔╝ ██╔══██╗ ██╔══██╗ ██╔══██╗ ██╔════╝  ██╔══██╗ ██║ ████╗  ██║',
  ' ██║   ██║   ███╔╝  ██████╔╝ ███████║ ██████╔╝ ██║  ███╗ ███████║ ██║ ██╔██╗ ██║',
  ' ██║   ██║  ███╔╝   ██╔══██╗ ██╔══██║ ██╔══██╗ ██║   ██║ ██╔══██║ ██║ ██║╚██╗██║',
  ' ╚██████╔╝ ███████╗ ██████╔╝ ██║  ██║ ██║  ██║ ╚██████╔╝ ██║  ██║ ██║ ██║ ╚████║',
  '  ╚═════╝  ╚══════╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝ ╚═╝ ╚═╝  ╚═══╝',
];

// Create gradient text for a single line
function GradientLine({ text, colors }) {
  const chars = text.split('');
  const colorPerChar = Math.max(1, Math.floor(chars.length / colors.length));

  return React.createElement(
    Box,
    null,
    chars.map((char, i) => {
      const colorIndex = Math.min(Math.floor(i / colorPerChar), colors.length - 1);
      return React.createElement(
        Text,
        { key: i, color: colors[colorIndex], bold: true },
        char
      );
    })
  );
}

// Logo component
function Logo() {
  return React.createElement(
    Box,
    { flexDirection: 'column' },
    LOGO_ART.map((line, i) =>
      React.createElement(GradientLine, { key: i, text: line, colors: SUNSET_COLORS })
    )
  );
}

// Fetch deals from RSS feed
async function fetchDeals() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    return feed.items.map((item, index) => ({
      id: index,
      title: item.title,
      link: item.link,
    }));
  } catch (err) {
    console.error('Failed to fetch deals:', err.message);
    return [];
  }
}

// Open URL in browser
function openBrowser(url) {
  const command = process.platform === 'darwin'
    ? `open "${url}"`
    : process.platform === 'win32'
    ? `start "${url}"`
    : `xdg-open "${url}"`;

  exec(command, (err) => {
    if (err) console.error('Failed to open browser:', err);
  });
}

// Main App
function App() {
  const { exit } = useApp();
  const [deals, setDeals] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeals().then((items) => {
      if (items.length === 0) {
        setError('Failed to load deals');
      } else {
        setDeals(items);
      }
      setLoading(false);
    });
  }, []);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();
    if (input === 'q') exit();

    if (loading || error || deals.length === 0) return;

    if (key.upArrow) {
      setSelectedIndex((i) => (i - 1 + deals.length) % deals.length);
    }
    if (key.downArrow) {
      setSelectedIndex((i) => (i + 1) % deals.length);
    }
    if (key.return) {
      openBrowser(deals[selectedIndex].link);
    }
  });

  if (loading) {
    return (
      <Box paddingX={1}>
        <Text dimColor>Loading deals from Ozbargain...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box paddingX={1}>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  const visibleCount = 5;
  let windowStart = selectedIndex - 2;

  // Keep window in bounds
  if (windowStart < 0) windowStart = 0;
  if (windowStart + visibleCount > deals.length) windowStart = Math.max(0, deals.length - visibleCount);

  const visibleDeals = deals.slice(windowStart, windowStart + visibleCount);

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Logo */}
      {!isDiscrete && (
        <Box marginBottom={1}>
          <Logo />
        </Box>
      )}

      {/* Header */}
      <Box marginBottom={1}>
        {isDiscrete && <Text bold color="#50FA7B">◈ OZBARGAIN</Text>}
        <Text dimColor> – Latest Deals ({deals.length})</Text>
      </Box>

      {/* Deals list */}
      <Box flexDirection="column">
        {visibleDeals.map((deal, index) => {
          const globalIndex = windowStart + index;
          const isSelected = globalIndex === selectedIndex;
          const indicator = isSelected ? '►' : ' ';

          return (
            <Box key={deal.id}>
              <Text color={isSelected ? '#FF79C6' : '#6272A4'} width={3}>
                {indicator}
              </Text>
              <Text
                color={isSelected ? '#FFFFFF' : '#F8F8F2'}
                bold={isSelected}
              >
                {deal.title.length > 80 ? deal.title.slice(0, 77) + '...' : deal.title}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          ↑↓: navigate | Enter: open deal | q: quit
        </Text>
      </Box>
    </Box>
  );
}

render(React.createElement(App));
