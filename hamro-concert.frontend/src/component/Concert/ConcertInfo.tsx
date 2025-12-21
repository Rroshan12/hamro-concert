type ConcertInfoProps = {
  title: string;
  artist: string;
  description: string;
};

function ConcertInfo({ title, artist, description }: ConcertInfoProps) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-2 theme-text-primary">
        {title}
      </h3>
      <p className="font-semibold text-lg mb-3 theme-text-primary-700">
        {artist}
      </p>
      <p className="text-sm mb-4 theme-text-secondary">
        {description}
      </p>
    </>
  );
}

export default ConcertInfo;
