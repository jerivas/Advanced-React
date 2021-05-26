import useForm from '../lib/useForm';

export default function CreateProduct() {
  const { inputs, handleChange, reset, clear } = useForm({
    name: '',
    price: 1,
  });
  return (
    <form>
      <label htmlFor="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="price">
        Price
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Price"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>
      <button onClick={reset} type="button">
        Reset
      </button>
      <button onClick={clear} type="button">
        Clear
      </button>
    </form>
  );
}
