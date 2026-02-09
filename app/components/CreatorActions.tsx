'use client';

import ShareButton from './ShareButton';
import SaveCreatorButton from './SaveCreatorButton';

interface CreatorActionsProps {
  creatorId: string;
  creatorName: string;
}

export default function CreatorActions({ creatorId, creatorName }: CreatorActionsProps) {
  return (
    <div className="flex gap-2">
      <SaveCreatorButton creatorId={creatorId} />
      <ShareButton 
        title={creatorName}
        description={`Explore the creative lineage of ${creatorName} on Lineage Lit`}
      />
    </div>
  );
}
