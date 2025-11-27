import type { Dataset } from '@/types/dataset';
import { FileText, TableCellsMerge } from 'lucide-react';

interface DatasetCardProps {
  dataset: Dataset;
  className?: string;
}

export function DatasetCard({ dataset, className = '' }: DatasetCardProps) {
  return (
    <a
      href={dataset.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card card-sm shadow-md border transition-all duration-300 cursor-pointer h-[100px] w-full relative overflow-hidden dataset-card ${className}`}
    >
      <div className="card-body p-0 h-full flex flex-row items-center gap-4">
        <div className="shrink-0">
          <TableCellsMerge className="w-10 h-10 dataset-card-content" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          <h2 className="card-title text-base font-semibold leading-tight line-clamp-2 p-0 m-0 dataset-card-content">
            {dataset.title}
          </h2>
          <p className="text-xs line-clamp-1 font-mono dataset-card-content">
            {dataset.doi}
          </p>
        </div>

        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
          <FileText className="w-5 h-5 shrink-0 drop-shadow-sm dataset-card-content" strokeWidth={2} />
        </div>
      </div>
    </a>
  );
}
