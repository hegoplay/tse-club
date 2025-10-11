export const HighlightText = (text: string, highlight: string = "") => {
  if (!highlight.trim() || !text) {
    return text;
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "#FDE68A" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export const tryParse = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};
