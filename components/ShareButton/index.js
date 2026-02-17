'use client';

import { useState } from 'react';
import { Share2, Check } from 'react-feather';
import { Box, Text } from 'grommet';

const ShareButton = ({ title, text, url }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title || 'Arti',
      text: text || 'Check this out on Arti',
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      onClick={handleShare}
      focusIndicator={false}
      style={{ cursor: 'pointer' }}
      className="share-button"
      pad={{ right: "medium" }}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      <Text size="small">
        {copied ? 'Copied Link' : 'Share'}
      </Text>
    </Box>
  );
};

export default ShareButton;
