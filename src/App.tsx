import { useMemo, useState } from "react";

type Answer = {
  text: string;
  points: number;
};

type Question = {
  id: string;
  round: number;
  set: string;
  prompt: string;
  answers: Answer[];
};

type Team = {
  id: number;
  name: string;
  score: number;
};

type GameState = {
  teams: Team[];
  activeTeamId: number;
  questionIndex: number;
  stagedQuestionIndex: number;
  revealed: number[];
  strikes: number;
  stealMode: boolean;
  blackout: boolean;
  bankOpen: boolean;
};

const questions: Question[] = [
  {
    id: "office-party-guests",
    round: 3,
    set: "Office Party Set",
    prompt: "Name something people hide before guests arrive",
    answers: [
      { text: "Dishes", points: 32 },
      { text: "Laundry", points: 24 },
      { text: "Clutter", points: 18 },
      { text: "Mail", points: 11 },
      { text: "Pet toys", points: 8 },
      { text: "Snacks", points: 7 },
    ],
  },
  {
    id: "meeting-phrases",
    round: 4,
    set: "Office Party Set",
    prompt: "Name a phrase people say when a meeting runs long",
    answers: [
      { text: "One more thing", points: 29 },
      { text: "Circle back", points: 24 },
      { text: "Quick question", points: 18 },
      { text: "Almost done", points: 14 },
      { text: "Take offline", points: 9 },
      { text: "Hard stop", points: 6 },
    ],
  },
  {
    id: "party-food",
    round: 5,
    set: "Office Party Set",
    prompt: "Name something people bring to a potluck",
    answers: [
      { text: "Chips", points: 31 },
      { text: "Dessert", points: 25 },
      { text: "Dip", points: 17 },
      { text: "Salad", points: 12 },
      { text: "Drinks", points: 9 },
      { text: "Napkins", points: 6 },
    ],
  },
  {
    id: "airport-bag",
    round: 6,
    set: "Travel Set",
    prompt: "Name something people forget to pack",
    answers: [
      { text: "Toothbrush", points: 34 },
      { text: "Charger", points: 27 },
      { text: "Socks", points: 15 },
      { text: "Passport", points: 11 },
      { text: "Medication", points: 8 },
      { text: "Sunscreen", points: 5 },
    ],
  },
  {
    id: "road-trip",
    round: 7,
    set: "Travel Set",
    prompt: "Name something people do on a long car ride",
    answers: [
      { text: "Sleep", points: 30 },
      { text: "Snack", points: 23 },
      { text: "Play music", points: 19 },
      { text: "Look outside", points: 12 },
      { text: "Use phone", points: 10 },
      { text: "Ask ETA", points: 6 },
    ],
  },
  {
    id: "weekend",
    round: 8,
    set: "Everyday Set",
    prompt: "Name something people look forward to on Friday",
    answers: [
      { text: "Sleeping in", points: 28 },
      { text: "Dinner out", points: 22 },
      { text: "No work", points: 20 },
      { text: "Seeing friends", points: 14 },
      { text: "Movies", points: 9 },
      { text: "Sports", points: 7 },
    ],
  },
];

const initialState: GameState = {
  teams: [
    { id: 1, name: "Team 1", score: 184 },
    { id: 2, name: "Team 2", score: 92 },
    { id: 3, name: "Team 3", score: 151 },
    { id: 4, name: "Team 4", score: 68 },
    { id: 5, name: "Team 5", score: 117 },
    { id: 6, name: "Team 6", score: 130 },
  ],
  activeTeamId: 1,
  questionIndex: 0,
  stagedQuestionIndex: 0,
  revealed: [0, 1],
  strikes: 2,
  stealMode: true,
  blackout: false,
  bankOpen: false,
};

function App() {
  const [session, setSession] = useState<{ game: GameState; history: GameState[] }>({
    game: initialState,
    history: [],
  });
  const [teamEditorOpen, setTeamEditorOpen] = useState(false);
  const { game, history } = session;

  const currentQuestion = questions[game.questionIndex];
  const stagedQuestion = questions[game.stagedQuestionIndex];
  const revealedSet = useMemo(() => new Set(game.revealed), [game.revealed]);
  const boardTotal = currentQuestion.answers.reduce(
    (total, answer, index) => total + (revealedSet.has(index) ? answer.points : 0),
    0,
  );
  const activeTeam = game.teams.find((team) => team.id === game.activeTeamId)!;

  function updateGame(mutator: (draft: GameState) => GameState) {
    setSession((current) => {
      const nextGame = mutator(current.game);
      return {
        game: nextGame,
        history: [current.game, ...current.history].slice(0, 20),
      };
    });
  }

  function revealAnswer(index: number) {
    if (revealedSet.has(index)) return;
    updateGame((draft) => ({
      ...draft,
      revealed: [...draft.revealed, index].sort((a, b) => a - b),
    }));
  }

  function setActiveTeam(teamId: number) {
    updateGame((draft) => ({ ...draft, activeTeamId: teamId }));
  }

  function addScore(delta: number) {
    updateGame((draft) => ({
      ...draft,
      teams: draft.teams.map((team) =>
        team.id === draft.activeTeamId
          ? { ...team, score: Math.max(0, team.score + delta) }
          : team,
      ),
    }));
  }

  function awardBoard() {
    if (boardTotal === 0) return;
    addScore(boardTotal);
  }

  function addStrike() {
    updateGame((draft) => ({ ...draft, strikes: Math.min(3, draft.strikes + 1) }));
  }

  function clearStrikes() {
    updateGame((draft) => ({ ...draft, strikes: 0 }));
  }

  function resetRound(nextIndex = game.questionIndex) {
    updateGame((draft) => ({
      ...draft,
      questionIndex: nextIndex,
      stagedQuestionIndex: nextIndex,
      revealed: [],
      strikes: 0,
      stealMode: false,
      blackout: false,
      bankOpen: false,
    }));
  }

  function sendLive() {
    resetRound(game.stagedQuestionIndex);
  }

  function nextRound() {
    resetRound((game.questionIndex + 1) % questions.length);
  }

  function toggleBank() {
    updateGame((draft) => ({ ...draft, bankOpen: !draft.bankOpen }));
  }

  function undo() {
    setSession((current) => {
      const [previous, ...rest] = current.history;
      if (!previous) return current;
      return { game: previous, history: rest };
    });
  }

  function renameTeam(teamId: number, name: string) {
    setSession((current) => ({
      ...current,
      game: {
        ...current.game,
        teams: current.game.teams.map((team) =>
          team.id === teamId ? { ...team, name: name.slice(0, 28) } : team,
        ),
      },
    }));
  }

  function resetTeamNames() {
    setSession((current) => ({
      ...current,
      game: {
        ...current.game,
        teams: current.game.teams.map((team) => ({ ...team, name: `Team ${team.id}` })),
      },
    }));
  }

  return (
    <>
      <main className="shell">
        <ScoreRail
          activeTeamId={game.activeTeamId}
          blackout={game.blackout}
          teams={game.teams}
          onBlackout={() => updateGame((draft) => ({ ...draft, blackout: !draft.blackout }))}
          onNewRound={nextRound}
          onOpenTeamEditor={() => setTeamEditorOpen(true)}
          onSelectTeam={setActiveTeam}
        />

        <section className="main-board">
          <Display
            activeTeam={activeTeam}
            blackout={game.blackout}
            boardTotal={boardTotal}
            question={currentQuestion}
            revealedSet={revealedSet}
            roundNumber={currentQuestion.round}
            stealMode={game.stealMode}
            strikes={game.strikes}
          />

          <HostControls
            activeTeam={activeTeam}
            boardTotal={boardTotal}
            currentQuestion={currentQuestion}
            game={game}
            questions={questions}
            revealedSet={revealedSet}
            stagedQuestion={stagedQuestion}
            onAddScore={addScore}
            onAddStrike={addStrike}
            onAwardBoard={awardBoard}
            onClearStrikes={clearStrikes}
            onEndRound={nextRound}
            onRevealAnswer={revealAnswer}
            onSafeDisplay={() => updateGame((draft) => ({ ...draft, blackout: false }))}
            onSelectQuestion={(index) =>
              updateGame((draft) => ({ ...draft, stagedQuestionIndex: index }))
            }
            onSendLive={sendLive}
            onSteal={() => updateGame((draft) => ({ ...draft, stealMode: !draft.stealMode }))}
            onToggleBank={toggleBank}
            onUndo={undo}
          />
        </section>
      </main>
      {teamEditorOpen && (
        <TeamNameModal
          teams={game.teams}
          onClose={() => setTeamEditorOpen(false)}
          onRenameTeam={renameTeam}
          onReset={resetTeamNames}
        />
      )}
    </>
  );
}

function ScoreRail({
  activeTeamId,
  blackout,
  teams,
  onBlackout,
  onNewRound,
  onOpenTeamEditor,
  onSelectTeam,
}: {
  activeTeamId: number;
  blackout: boolean;
  teams: Team[];
  onBlackout: () => void;
  onNewRound: () => void;
  onOpenTeamEditor: () => void;
  onSelectTeam: (teamId: number) => void;
}) {
  return (
    <aside className="score-rail">
      <div className="rail-head">
        <span className="eyebrow">Live standings</span>
        <h1>Family Feud</h1>
      </div>
      <div className="teams">
        {teams.map((team) => (
          <button
            className={`team ${team.id === activeTeamId ? "active" : ""}`}
            key={team.id}
            onClick={() => onSelectTeam(team.id)}
          >
            <span>{teamDisplayName(team)}</span>
            <strong>{team.score}</strong>
          </button>
        ))}
      </div>
      <div className="rail-foot">
        <button className="small-btn" onClick={onNewRound}>
          New Round
        </button>
        <button className="small-btn" onClick={onBlackout}>
          {blackout ? "Restore" : "Blackout"}
        </button>
        <button className="small-btn" onClick={onOpenTeamEditor}>
          Team Names
        </button>
      </div>
    </aside>
  );
}

function Display({
  activeTeam,
  blackout,
  boardTotal,
  question,
  revealedSet,
  roundNumber,
  stealMode,
  strikes,
}: {
  activeTeam: Team;
  blackout: boolean;
  boardTotal: number;
  question: Question;
  revealedSet: Set<number>;
  roundNumber: number;
  stealMode: boolean;
  strikes: number;
}) {
  const strikeMarks = "X".repeat(strikes);

  return (
    <section className={`display ${blackout ? "blackout" : ""}`}>
      {blackout ? (
        <div className="blackout-screen">
          <span>Family Feud</span>
        </div>
      ) : (
        <>
          <div className="display-head">
            <strong>Round {roundNumber}</strong>
            <span>Active: {teamDisplayName(activeTeam)}</span>
          </div>
          <div className="board-zone">
            <div className="question">
              <h2>{question.prompt}</h2>
              <p>Board total updates as answers reveal</p>
            </div>
            <div className="board">
              {question.answers.map((answer, index) => {
                const isRevealed = revealedSet.has(index);
                return (
                  <div className={`tile ${isRevealed ? "" : "hidden"}`} key={answer.text}>
                    <span>{index + 1}</span>
                    <span>{isRevealed ? answer.text : "Hidden"}</span>
                    <span>{isRevealed ? answer.points : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="display-foot">
            <span>{stealMode ? "Steal mode ready" : "Round in play"}</span>
            <span className="xs">{strikeMarks || " "}</span>
            <span className="points">Board {boardTotal}</span>
          </div>
        </>
      )}
    </section>
  );
}

function HostControls({
  activeTeam,
  boardTotal,
  currentQuestion,
  game,
  questions,
  revealedSet,
  stagedQuestion,
  onAddScore,
  onAddStrike,
  onAwardBoard,
  onClearStrikes,
  onEndRound,
  onRevealAnswer,
  onSafeDisplay,
  onSelectQuestion,
  onSendLive,
  onSteal,
  onToggleBank,
  onUndo,
}: {
  activeTeam: Team;
  boardTotal: number;
  currentQuestion: Question;
  game: GameState;
  questions: Question[];
  revealedSet: Set<number>;
  stagedQuestion: Question;
  onAddScore: (delta: number) => void;
  onAddStrike: () => void;
  onAwardBoard: () => void;
  onClearStrikes: () => void;
  onEndRound: () => void;
  onRevealAnswer: (index: number) => void;
  onSafeDisplay: () => void;
  onSelectQuestion: (index: number) => void;
  onSendLive: () => void;
  onSteal: () => void;
  onToggleBank: () => void;
  onUndo: () => void;
}) {
  return (
    <section className="host">
      <div className="stack primary-stack">
        <div className="panel question-panel">
          <h3>Question bank</h3>
          <strong>
            R{stagedQuestion.round} / {stagedQuestion.set}
          </strong>
          <p>{stagedQuestion.prompt}</p>
          {game.bankOpen && (
            <div className="bank-list">
              {questions.map((question, index) => (
                <button
                  className={index === game.stagedQuestionIndex ? "selected-bank-item" : ""}
                  key={question.id}
                  onClick={() => onSelectQuestion(index)}
                >
                  <span>R{question.round}</span>
                  <strong>{question.prompt}</strong>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="panel answer-panel">
          <h3>Answer controls</h3>
          {currentQuestion.answers.map((answer, index) => {
            const isRevealed = revealedSet.has(index);
            return (
              <div className={`answer ${isRevealed ? "revealed" : ""}`} key={answer.text}>
                <span className="num">{index + 1}</span>
                <strong>{answer.text}</strong>
                <span>{answer.points}</span>
                <button
                  className={`btn ${isRevealed ? "primary" : ""}`}
                  disabled={isRevealed}
                  onClick={() => onRevealAnswer(index)}
                >
                  Reveal
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stack">
        <div className="panel">
          <h3>Round actions</h3>
          <div className="control-grid">
            <button className="btn primary" onClick={onSendLive}>
              Send Live
            </button>
            <button className="btn" onClick={() => onSelectQuestion(game.questionIndex)}>
              Preview
            </button>
            <button className="btn" disabled={boardTotal === 0} onClick={onAwardBoard}>
              Award
            </button>
            <button className="btn" onClick={onSteal}>
              Steal
            </button>
            <button className="btn" onClick={onUndo}>
              Undo
            </button>
            <button className="btn" onClick={onEndRound}>
              End
            </button>
          </div>
        </div>
        <div className="panel">
          <h3>Score correction</h3>
          <div className="score-target">{teamDisplayName(activeTeam)}</div>
          <div className="control-grid">
            <button className="btn" onClick={() => onAddScore(10)}>
              +10
            </button>
            <button className="btn" onClick={() => onAddScore(-10)}>
              -10
            </button>
            <button className="btn" onClick={() => onAddScore(5)}>
              +5
            </button>
            <button className="btn" onClick={() => onAddScore(-5)}>
              -5
            </button>
          </div>
        </div>
      </div>

      <div className="stack strike-stack">
        <div className="strike-box">{"X".repeat(game.strikes) || "0"}</div>
        <button className="btn primary" onClick={onAddStrike}>
          Add Strike
        </button>
        <button className="btn" onClick={onClearStrikes}>
          Clear Strikes
        </button>
        <button className="btn" onClick={onSafeDisplay}>
          Safe Display
        </button>
        <button className={`btn ${game.bankOpen ? "primary" : ""}`} onClick={onToggleBank}>
          Question Bank
        </button>
      </div>
    </section>
  );
}

function TeamNameModal({
  teams,
  onClose,
  onRenameTeam,
  onReset,
}: {
  teams: Team[];
  onClose: () => void;
  onRenameTeam: (teamId: number, name: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="team-modal" role="dialog">
        <div className="modal-head">
          <h2>Team Names</h2>
          <button className="icon-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="team-name-grid">
          {teams.map((team) => (
            <label className="team-name-field" key={team.id}>
              <span>Team {team.id}</span>
              <input
                maxLength={28}
                onChange={(event) => onRenameTeam(team.id, event.target.value)}
                value={team.name}
              />
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onReset}>
            Reset
          </button>
          <button className="btn primary" onClick={onClose}>
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

function teamDisplayName(team: Team) {
  return team.name.trim() || `Team ${team.id}`;
}

export default App;
