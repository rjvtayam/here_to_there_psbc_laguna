import { TalkButton } from '../../components/controls/TalkButton';
import { ShareScreenButton } from '../../components/controls/ShareScreenButton';
import { EmergencyButton } from '../../components/controls/EmergencyButton';
import { BulletinBoard } from '../../components/announcements/BulletinBoard';

interface ControlPanelProps {
  activeTalkTarget: 'paete' | 'pagsanjan' | 'both' | null;
  isScreenSharing: boolean;
  onTalkTo: (target: 'paete' | 'pagsanjan' | 'both') => void;
  onShareScreen: () => void;
  onEmergency: () => void;
}

export function ControlPanel({
  activeTalkTarget,
  isScreenSharing,
  onTalkTo,
  onShareScreen,
  onEmergency,
}: ControlPanelProps) {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <TalkButton
          target="paete"
          isActive={activeTalkTarget === 'paete'}
          onClick={() => onTalkTo('paete')}
        />
        <TalkButton
          target="pagsanjan"
          isActive={activeTalkTarget === 'pagsanjan'}
          onClick={() => onTalkTo('pagsanjan')}
        />
        <TalkButton
          target="both"
          isActive={activeTalkTarget === 'both'}
          onClick={() => onTalkTo('both')}
        />
      </div>

      <div className="flex items-center gap-2">
        <ShareScreenButton
          isSharing={isScreenSharing}
          onClick={onShareScreen}
        />

        <BulletinBoard />

        <EmergencyButton onClick={onEmergency} />
      </div>
    </div>
  );
}
