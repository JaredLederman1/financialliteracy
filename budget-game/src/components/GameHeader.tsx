interface GameHeaderProps {
  seed: number;
}

export function GameHeader({ seed }: GameHeaderProps) {
  return (
    <header className="text-center mb-6">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-amber-800 mb-2 drop-shadow-sm">
        💰 One Month, One Budget 💰
      </h1>
      <p className="font-body text-lg text-amber-700 max-w-2xl mx-auto">
        Can you manage your money for a whole month? Make smart choices about 
        <span className="font-bold text-green-600"> needs </span> 
        vs 
        <span className="font-bold text-purple-600"> wants</span>!
      </p>
      {seed > 0 && (
        <p className="font-body text-sm text-amber-600 mt-2">
          🎲 Seed: <span className="font-mono bg-amber-100 px-2 py-0.5 rounded">{seed}</span>
        </p>
      )}
    </header>
  );
}

