'use client';

const colorMap = {
  'Yellow': 'rgba(255, 206, 86, 0.5)',
  'Blue': 'rgba(54, 162, 235, 0.5)',
  'Red': 'rgba(255, 99, 132, 0.5)',
  'Green': 'rgba(75, 192, 192, 0.5)',
  'Orange': 'rgba(255, 198, 140, 1)',
  'Gray': 'rgba(200, 200, 200, 1)',
  'Black': 'rgba(0, 0, 0, 0.5)',
  'Pink': 'rgba(255, 182, 193, 0.5)',
  'Purple': 'rgba(147, 112, 219, 0.5)',
  'White': 'rgba(255, 255, 255, 0.5)'
};

const ColorDescription = ({ color }) => {
  const descriptions = {
    Yellow: `Yellow is the color of happiness, optimism, creativity, and intellect. Yellow inspires communication and encourages playfulness, curiosity, and learning. It's a mentally activating hue associated with innovative thinking and mental clarity.`,

    Blue: `Those with a blue personality are often honest, committed, and supportive individuals who value friendship and strive for balance in their lives. They are dependable and emotionally aware, seeking order and harmony in both relationships and environments. Blue personalities are deeply affected by chaos or betrayal and may feel overwhelmed or nostalgic when stability is disrupted.`,

    Black: `Black is a color often associated with mystery, elegance, and power. Individuals with a black personality are typically conservative, independent, and determined, often striving for control and creating an aura of mystery. They may appear emotionless and intimidating, using black as a protective barrier to hide vulnerabilities and insecurities.`,

    Green: `Individuals with a green personality are diplomatic, peaceful, and caring, striving to bring harmony to their communities. They are practical and down-to-earth, with a strong sense of loyalty and a desire to belong. Green personalities value balance and peace, often focusing on the future and making mindful decisions. They are generous and caring but should be cautious not to neglect themselves while taking care of others. Their need to belong can sometimes lead to self-righteousness or jealousy if they feel unacknowledged.`,

    Orange: `Individuals with an orange personality are typically extroverted, adventurous, and creative, thriving in dynamic environments and seeking new experiences. They are warm, good-natured, and their enthusiasm is contagious. Orange personalities value social interaction and are often seen as the life of the party, but their need for excitement can sometimes lead to inconsistency and unpredictability.`,

    Pink: `Individuals with a pink personality are typically loving, kind, and generous, often putting the needs of others before their own. They are approachable and have a charming, youthful demeanor that draws people in. However, they may also exhibit traits of immaturity and naivety, sometimes viewing the world through rose-colored glasses. Their desire for unconditional love and acceptance can lead to disappointment if not reciprocated. While their optimism and sensitivity are strengths, they should be mindful of becoming overly dependent on others for validation.`,

    Purple: `Purple personalities are charismatic, introverted, and visionary, often pursuing humanitarian causes and artistic passions. However, their emotional depth can lead to hypersensitivity, arrogance, or moodiness. The color also represents a longing for emotional stability, personal authenticity, and self-knowledge.`,

    Red: `Individuals with a red personality are typically outgoing, assertive, and passionate, often seeking attention and excitement. They are warm, good-natured, and their enthusiasm is contagious. However, they may also exhibit negative traits such as impulsiveness, selfishness, and aggression. Red personalities value passion and intensity, often focusing on the present and making impulsive decisions. They are warm and good-natured but should be mindful of becoming too self-centered or aggressive.`,

    White: `Individuals with a white personality are typically optimistic, friendly, and open-minded, often seeking harmony and balance in their lives. They are warm, good-natured, and their enthusiasm is contagious. However, they may also exhibit negative traits such as naivety, gullibility, and superficiality. White personalities value harmony and balance, often focusing on the present and making mindful decisions. They are warm and good-natured but should be mindful of becoming too idealistic or naive.`
  };

  return (
    <div className="mt-4">
      <p className="text-sm leading-relaxed">{descriptions[color] || 'Description not available.'}</p>
    </div>
  );
};

export const PersonalityCard = ({ person }) => {
  if (!person) return null;

  const baseColor = colorMap[person.suggested_color] || colorMap.Gray;
  const backgroundColor = baseColor.replace('0.5', '0.3');

  return (
    <div
      className="h-[500px] rounded-lg p-6 shadow-lg overflow-y-auto"
      style={{
        backgroundColor: backgroundColor,
        backdropFilter: 'blur(8px)',
      }}
    >
      <h2 className="text-3xl font-bold mb-6">
        {person.name.charAt(0).toUpperCase() + person.name.slice(1)}
      </h2>

      {/* Positive Traits */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Positive Traits</h3>
        <div className="flex flex-wrap gap-2">
          {person.pos_traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-white/50 rounded-full text-base transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Negative Traits */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Negative Traits</h3>
        <div className="flex flex-wrap gap-2">
          {person.neg_traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-white/50 rounded-full text-base transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Color Personality */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Color Personality</h3>
        <ColorDescription color={person.suggested_color} />
      </div>
    </div>
  );
};