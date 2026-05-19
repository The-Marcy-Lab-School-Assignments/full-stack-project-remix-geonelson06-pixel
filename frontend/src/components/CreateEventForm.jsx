import { createEvent } from '../adapters/event-adapters';

const CreateEventForm = ({ loadEvents }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const body = {
      title: form.title.value,
      game: form.game.value,
      minigame_type: form.minigame_type.value,
      rules: form.rules.value,
      event_date: form.event_date.value,
    };

    const { error } = await createEvent(body);

    if (error) {
      return alert(error);
    }

    form.reset();

    loadEvents();
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>Create Party Event</h2>

      <input
        name="title"
        placeholder="Event Title"
        required
      />

      <select name="game">
        <option>Mario Party Superstars</option>
        <option>Super Mario Party</option>
        <option>Mario Party 8</option>
      </select>

      <select name="minigame_type">
        <option>Skill-Based</option>
        <option>Luck-Based</option>
        <option>Mixed</option>
      </select>

      <input
        name="rules"
        placeholder="Custom Rules"
      />

      <input
        type="datetime-local"
        name="event_date"
      />

      <button>Create Event</button>
    </form>
  );
};

export default CreateEventForm;