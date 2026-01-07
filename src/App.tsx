import { useReducer, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { adventureReducer, createInitialAdventureState } from './game/adventureReducer';
import { StartScreen, PhoneOverlay, ResultsOverlay, ChapterEndScreen } from './components/game';
import { Onboarding, isOnboardingComplete, clearAllData, loadAccount, loadOnboardingProfile } from './onboarding';
import { PhaserTownView } from './phaser';
import type { PlayerProfile } from './game/types';

function App() {
  const [state, dispatch] = useReducer(adventureReducer, createInitialAdventureState());
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Check onboarding status on mount
  useEffect(() => {
    setShowOnboarding(!isOnboardingComplete());
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Load account name for game
    const account = loadAccount();
    const profile = loadOnboardingProfile();
    if (account && profile) {
      // Auto-start a new game with the account name
      dispatch({ 
        type: 'START_NEW_GAME', 
        playerName: account.firstName, 
        seed: Date.now() 
      });
    }
  };

  const handleNewGame = (name: string, seed: number) => {
    dispatch({ type: 'START_NEW_GAME', playerName: name, seed });
  };

  const handleLoadGame = (profile: PlayerProfile) => {
    dispatch({ type: 'LOAD_GAME', profile });
  };

  const handleStartQuest = (questId: string) => {
    dispatch({ type: 'START_QUEST', questId });
  };

  const handleAdvanceStep = () => {
    dispatch({ type: 'ADVANCE_STEP' });
  };

  const handleMakeChoice = (choiceId: string) => {
    dispatch({ type: 'MAKE_CHOICE', choiceId });
  };

  const handleReturnToMap = () => {
    dispatch({ type: 'RETURN_TO_MAP' });
  };

  const handleReset = () => {
    clearAllData();
    dispatch({ type: 'RESET_GAME' });
    setShowOnboarding(true);
  };

  // Loading state while checking onboarding
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Show onboarding if not complete
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* Start Screen */}
        {(state.screen === 'title' || state.screen === 'name-entry') && (
          <StartScreen
            key="start"
            onNewGame={handleNewGame}
            onLoadGame={handleLoadGame}
            onResetProfile={handleReset}
          />
        )}

        {/* Phaser Town Map - always rendered when player exists and not on title/chapter-end */}
        {state.player && state.screen !== 'title' && state.screen !== 'name-entry' && state.screen !== 'chapter-end' && (
          <PhaserTownView
            key="phaser-map"
            player={state.player}
            onSelectQuest={handleStartQuest}
          />
        )}

        {/* Chapter End Screen */}
        {state.screen === 'chapter-end' && state.player && (
          <ChapterEndScreen
            key="chapter-end"
            player={state.player}
            onPlayAgain={handleReset}
          />
        )}
      </AnimatePresence>

      {/* Quest Overlay - Phone UI for all quests */}
      <AnimatePresence>
        {state.screen === 'quest' && state.player && state.currentQuest && (
          <PhoneOverlay
            key="phone-quest"
            quest={state.currentQuest}
            player={state.player}
            onAdvance={handleAdvanceStep}
            onMakeChoice={handleMakeChoice}
          />
        )}
      </AnimatePresence>

      {/* Results Overlay - appears on top of map */}
      <AnimatePresence>
        {state.screen === 'quest-result' && state.player && state.questResult && (
          <ResultsOverlay
            key="results"
            result={state.questResult}
            player={state.player}
            onContinue={handleReturnToMap}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
