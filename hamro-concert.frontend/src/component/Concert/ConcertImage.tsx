type ConcertImageProps = {
  image: string;
  title: string;
  totalAvailable: number;
};

function ConcertImage({ image, title, totalAvailable }: ConcertImageProps) {
  return (
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 right-3 theme-bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
        {totalAvailable} tickets left
      </div>
    </div>
  );
}

export default ConcertImage;
