import React, { useState } from 'react';
import { Share2, Link, Twitter, Facebook } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { Place } from '../../types';

interface ShareButtonProps {
  place: Place;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ place }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
    setIsOpen(false);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out ${place.name} on KazTourism!`);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
          >
            <Link className="w-4 h-4" />
            Copy Link
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
          >
            <Twitter className="w-4 h-4" />
            Share on Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
          >
            <Facebook className="w-4 h-4" />
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  );
};