
import React, { useState, useEffect, useMemo } from 'react';

interface GameProps {
  onComplete: () => void;
}

const easyTongueTwisters = [
    "O rato roeu a roupa do rei de Roma.",
    "Três pratos de trigo para três tigres tristes.",
    "O peito do pé de Pedro é preto.",
    "A aranha arranha a rã. A rã arranha a aranha.",
    "Sabia que o sabiá sabia assobiar?",
];

const hardTongueTwisters = [
    "Sabendo o que sei e sabendo o que sabes e o que não sabes e o que não sabemos, ambos saberemos se somos sábios, sabidos ou simplesmente saberemos se somos sabedores.",
    "O desinquivincavacador das caravelarias desinquivincavacaria as cavidades que deveriam ser desinquivincavacadas.",
    "Esta casa está ladrilhada, quem a desenladrilhará? O desenladrilhador. O desenladrilhador que a desenladrilhar, bom desenladrilhador será!",
    "Há quatro quadros três e três quadros quatro. Sendo que quatro destes quadros são quadrados, um dos quadros quatro e três dos quadros três. Os três quadros que não são quadrados são dois dos quadros quatro e um dos quadros três.",
    "A hidra, a dríade e o dragão, ladrões do dromedário do Druida, foram apedrejados.",
    "Disseram que na minha rua tem paralelepípedo feito de paralelogramos. Seis paralelogramos têm um paralelepípedo. Mil paralelepípedos têm uma paralelepipedovia. Uma paralelepipedovia tem mil paralelogramos. Então uma paralelepipedovia é uma paralelogramolândia?",
    "Não confunda ornitorrinco com otorrinolaringologista, ornitorrinco com ornitologista, ornitologista com otorrinolaringologista, porque ornitorrinco é ornitorrinco, ornitologista é ornitologista, e otorrinolaringologista é otorrinolaringologista."
];

const BaseGame: React.FC<GameProps & { mode: 'ranked' | 'free', phrases: string[], timePerRound: number }> = ({ onComplete, mode, phrases, timePerRound }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [feedback, setFeedback] = useState('');

  const currentTwister = phrases[currentIndex];

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) {
      if (gameState === 'playing' && timeLeft <= 0) {
        setFeedback("Tempo esgotado! Tente ser mais rápido no próximo.");
        setTimeLeft(timePerRound);
      }
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [gameState, timeLeft, timePerRound]);

  const handleStart = () => {
    setCurrentIndex(0);
    setTimeLeft(timePerRound);
    setGameState('playing');
    setFeedback('');
  };

  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(timePerRound); // Reset timer
        setFeedback("Muito bem! Próximo...");
    } else {
        setGameState('finished');
        onComplete();
        setFeedback(mode === 'ranked' 
            ? "Excelente! Você completou o desafio de elite!" 
            : "Ótimo treino! Continue praticando.");
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
        <h3 className="text-xl font-bold font-oxanium text-purple-300 mb-2">
            {mode === 'ranked' ? 'Desafio de Elite' : 'Treino Livre'}
        </h3>
        <p className="text-gray-400 mb-4">
            {mode === 'ranked' 
                ? `Complete 3 trava-línguas difíceis aleatórios. Você tem ${timePerRound} segundos para cada.` 
                : `Pratique sem pressão com trava-línguas variados. ${timePerRound} segundos sugeridos.`}
        </p>
        <button
          onClick={handleStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Começar
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
      return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
            <h3 className="text-xl font-bold font-oxanium text-green-400 mb-2">Concluído!</h3>
            <p className="text-gray-300 mb-4">{feedback}</p>
        </div>
      );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold font-oxanium text-purple-300">
            {mode === 'ranked' ? 'Desafio' : 'Treino'} {currentIndex + 1}/{phrases.length}
        </h3>
        <div className={`text-2xl font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-yellow-300'}`}>{timeLeft}s</div>
      </div>
      
      <div className="bg-gray-900/50 p-6 rounded-lg mb-6 min-h-[120px] flex items-center justify-center border border-gray-700">
          <p className="text-md md:text-lg font-semibold text-white leading-relaxed">{currentTwister}</p>
      </div>
      
      {feedback && <p className="text-green-400 text-sm mb-4 font-bold animate-pulse">{feedback}</p>}

      <button
        onClick={handleNext}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition transform active:scale-95 shadow-lg shadow-green-900/20"
      >
        {currentIndex < phrases.length - 1 ? 'Próximo' : 'Finalizar'}
      </button>
    </div>
  );
};

export const RankedTongueTwisterGame: React.FC<GameProps> = (props) => {
    // Select 3 random unique hard twisters
    const phrases = useMemo(() => {
        const shuffled = [...hardTongueTwisters].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }, []);

    return <BaseGame {...props} mode="ranked" phrases={phrases} timePerRound={25} />;
};

export const FreeTongueTwisterGame: React.FC<GameProps> = (props) => {
    // Use standard ones for free practice
    const phrases = easyTongueTwisters;

    return <BaseGame {...props} mode="free" phrases={phrases} timePerRound={15} />;
};
