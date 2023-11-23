export default function RecipientInfo({ type, name }) {
  return (
    <div className="flex justify-between border-b-2 border-gray-300">
      <p className="font-medium">{type}:&nbsp;</p>
      <p>{name}</p>
    </div>
  );
}
