#!/usr/bin/env node

/**
 * OZBARGAIN CLI - Browse latest deals from Ozbargain.com.au
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import Parser from 'rss-parser';
import { exec } from 'child_process';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';

const parser = new Parser();
const RSS_URL = 'https://www.ozbargain.com.au/deals/feed';

// Sunset gradient colors
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

// Logo component with gradient
function Logo() {
  return (
    <Box flexDirection="column">
      {LOGO_ART.map((line, i) => (
        <Gradient key={i} colors={SUNSET_COLORS}>
          <Text bold>{line}</Text>
        </Gradient>
      ))}
    </Box>
  );
}

// Loading component with logo and spinner
function LoadingScreen() {
  return (
    <Box flexDirection="column" paddingX={1}>
      {!isDiscrete && <Logo />}
      <Box marginTop={1}>
        <Text color="#ff9966">
          <Spinner type="dots" /> <Text dimColor>Loading deals from Ozbargain...</Text>
        </Text>
      </Box>
    </Box>
  );
}

// Error component with logo
function ErrorScreen({ error }) {
  return (
    <Box flexDirection="column" paddingX={1}>
      {!isDiscrete && <Logo />}
      <Box marginTop={1}>
        <Text color="red">✗ {error}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Press Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
}

// Fetch deals from RSS feed
async function fetchDeals() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    return { success: true, items: feed.items.map((item, index) => ({
      id: index,
      title: item.title,
      link: item.link,
    }))};
  } catch (err) {
    return { success: false, error: err.message || 'Unknown error' };
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
    fetchDeals().then((result) => {
      setLoading(false);
      if (result.success) {
        setDeals(result.items);
      } else {
        setError(`Failed to load deals: ${result.error}`);
      }
    });
  }, []);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();
    if (input === 'q') exit();

    // Allow quit even on error screen
    if (error && (input === 'q' || (key.ctrl && input === 'c'))) {
      exit();
      return;
    }

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

  // Loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Error screen
  if (error) {
    return <ErrorScreen error={error} />;
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

render(<App />);
