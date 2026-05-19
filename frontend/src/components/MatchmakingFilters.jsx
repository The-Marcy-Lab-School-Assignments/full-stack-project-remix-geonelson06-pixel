const MatchmakingFilters = ({
  selectedGame,
  setSelectedGame,
  selectedType,
  setSelectedType,
}) => {
  return (
    <div className="filters">
      <select
        value={selectedGame}
        onChange={(e) =>
          setSelectedGame(e.target.value)
        }
      >
        <option value="">
          All Games
        </option>

        <option>
          Mario Party Superstars
        </option>

        <option>
          Super Mario Party
        </option>

        <option>
          Mario Party 8
        </option>
      </select>

      <select
        value={selectedType}
        onChange={(e) =>
          setSelectedType(e.target.value)
        }
      >
        <option value="">
          All Types
        </option>

        <option>
          Skill-Based
        </option>

        <option>
          Luck-Based
        </option>

        <option>
          Mixed
        </option>
      </select>
    </div>
  );
};

export default MatchmakingFilters;