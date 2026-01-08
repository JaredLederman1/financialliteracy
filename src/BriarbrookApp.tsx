import { useReducer, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { briarbrookReducer, createInitialState } from './game/briarbrook/reducer';
import { deleteSavedGame } from './game/briarbrook/storage';
import { BriarbrookTownView } from './phaser/BriarbrookTownView';
import {
  BriarbrookStartScreen,
  ContractMenuOverlay,
  BriefingOverlay,
  ContractRunnerOverlay,
  ReflectionOverlay,
  ContractResultsOverlay,
} from './components/briarbrook';
import type { BriarbrookPlayer } from './game/briarbrook/types';

export function BriarbrookApp() {
  const [state, dispatch] = useReducer(briarbrookReducer, createInitialState());

  // Handlers
  const handleNewGame = useCallback((name: string, seed: number) => {
    dispatch({ type: 'START_NEW_GAME', playerName: name, seed });
  }, []);

  const handleLoadGame = useCallback((player: BriarbrookPlayer) => {
    dispatch({ type: 'LOAD_GAME', player });
  }, []);

  const handleBuildingClick = useCallback((buildingId: string) => {
    dispatch({ type: 'OPEN_BUILDING', buildingId });
  }, []);

  const handleCloseMenu = useCallback(() => {
    dispatch({ type: 'CLOSE_MENU' });
  }, []);

  const handleSelectContract = useCallback((contractId: string) => {
    dispatch({ type: 'START_CONTRACT', contractId });
  }, []);

  const handleAdvanceBriefing = useCallback(() => {
    dispatch({ type: 'ADVANCE_BRIEFING' });
  }, []);

  const handleAdvanceStep = useCallback(() => {
    dispatch({ type: 'ADVANCE_STEP' });
  }, []);

  const handleMakeChoice = useCallback((choiceId: string) => {
    dispatch({ type: 'MAKE_CHOICE', choiceId });
  }, []);

  const handleSubmitReflection = useCallback((choiceId: string) => {
    dispatch({ type: 'SUBMIT_REFLECTION', choiceId });
  }, []);

  const handleReturnToTown = useCallback(() => {
    dispatch({ type: 'RETURN_TO_TOWN' });
  }, []);

  const handleReset = useCallback(() => {
    deleteSavedGame();
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Check if any overlay is open (for pausing movement)
  const hasOverlay = state.screen !== 'town' && state.screen !== 'title';

  return (
    <div className="min-h-screen">
      {/* Title Screen */}
      {state.screen === 'title' && (
        <BriarbrookStartScreen
          onNewGame={handleNewGame}
          onLoadGame={handleLoadGame}
          onReset={handleReset}
        />
      )}

      {/* Town View (always rendered when player exists) */}
      {state.player && state.screen !== 'title' && (
        <BriarbrookTownView
          player={state.player}
          onBuildingClick={handleBuildingClick}
          isOverlayOpen={hasOverlay}
        />
      )}

      {/* Contract Menu Overlay */}
      <AnimatePresence>
        {state.screen === 'contract-menu' && state.player && state.selectedBuildingId && (
          <ContractMenuOverlay
            key="contract-menu"
            buildingId={state.selectedBuildingId}
            player={state.player}
            onSelectContract={handleSelectContract}
            onClose={handleCloseMenu}
          />
        )}
      </AnimatePresence>

      {/* Briefing Overlay */}
      <AnimatePresence>
        {state.screen === 'briefing' && state.player && state.currentContract && (
          <BriefingOverlay
            key="briefing"
            contract={state.currentContract}
            player={state.player}
            onAdvance={handleAdvanceBriefing}
          />
        )}
      </AnimatePresence>

      {/* Contract Runner Overlay */}
      <AnimatePresence>
        {state.screen === 'contract' && state.player && state.currentContract && (
          <ContractRunnerOverlay
            key="contract-runner"
            contract={state.currentContract}
            player={state.player}
            onAdvance={handleAdvanceStep}
            onMakeChoice={handleMakeChoice}
          />
        )}
      </AnimatePresence>

      {/* Reflection Overlay */}
      <AnimatePresence>
        {state.screen === 'reflection' && state.player && state.currentContract && (
          <ReflectionOverlay
            key="reflection"
            contract={state.currentContract}
            player={state.player}
            onSubmit={handleSubmitReflection}
          />
        )}
      </AnimatePresence>

      {/* Results Overlay */}
      <AnimatePresence>
        {state.screen === 'results' && state.player && state.contractResult && (
          <ContractResultsOverlay
            key="results"
            result={state.contractResult}
            player={state.player}
            onContinue={handleReturnToTown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

