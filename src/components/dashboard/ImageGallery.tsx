import React, { useState } from 'react';
import { ResearchReport } from '../../types/research';
import { Card } from '../ui/Card';
import { Maximize2, X } from 'lucide-react';

interface ImageGalleryProps {
  report: ResearchReport;
}

export function ImageGallery({ report }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Visual Evidence Gallery</h2>
        <p className="text-slate-400 text-sm">Review image assets, infographics, and visual metadata scraped directly from verified webpages.</p>
      </div>

      {report.images && report.images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {report.images.map((img, idx) => (
            <Card
              key={idx}
              onClick={() => setActiveImage(img.url)}
              className="group p-2 bg-slate-950/45 border border-white/5 hover:border-purple-500/25 cursor-pointer relative overflow-hidden transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 relative">
                <img
                  src={img.url}
                  alt={img.alt || 'Visual evidence'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fail gracefully
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Overlay Hover details */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/35">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Caption */}
              {img.alt && (
                <p className="text-[11px] text-slate-400 mt-2 px-1 line-clamp-1 italic">
                  "{img.alt}"
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/10 border border-white/5 rounded-2xl">
          <span className="text-slate-500 text-sm">No images were extracted from the scraped source pages.</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] bg-slate-900 border border-white/10 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 rounded-full text-slate-400 hover:text-white border border-white/5 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={activeImage}
              alt="Scraped source evidence"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
