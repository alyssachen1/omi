const ColorDescription = ({ color }) => {
  const descriptions = {
    Yellow: `Yellow is the color of happiness, optimism, creativity, and intellect. It is bright and cheerful, known to stimulate mental activity, sharpen memory, and energize the spirit. Yellow inspires communication and encourages playfulness, curiosity, and learning. It's a mentally activating hue associated with innovative thinking and mental clarity.

    However, yellow also carries intense emotional and psychological influence. When overused, it can induce anxiety, impatience, and nervousness. It may cause people to become overcritical or overwhelmed. Yellow is linked to fear, betrayal, cowardice, and impulsiveness, reflecting the color's potential to stimulate discomfort as much as joy.
    
    Yellow is often used as a highlight or attention-getter rather than a base tone. Its association with sunshine and brightness makes it uplifting and eye-catching—but its power can be overwhelming without balance.`,
    
    Blue: `Blue is the most universally appealing color on the spectrum due to its non-polarizing traits. It is calming, relaxing, and offers a sense of peace, serenity, and emotional stability. Blue symbolizes trust, responsibility, and loyalty, while also conveying authority and structure. 

    Those with a blue personality are often honest, committed, and supportive individuals who value friendship and strive for balance in their lives. They are dependable and emotionally aware, seeking order and harmony in both relationships and environments. Blue personalities are deeply affected by chaos or betrayal and may feel overwhelmed or nostalgic when stability is disrupted.

    On the downside, they can be conservative, predictable, and resistant to change. While generally warm and caring, their emphasis on control and structure can also make them come across as rigid or emotionally distant.

    Too much exposure to blue may suppress appetite and melatonin. Though rare in nature, blue is tied closely to elements like the sky and sea, both of which contribute to its widespread associations with depth, openness, and tranquility.
    `,

    Black: `Black is a color often associated with mystery, elegance, and power. It conveys authority and sophistication, making it a popular choice in fashion and design. Individuals with a black personality are typically conservative, independent, and determined, often striving for control and creating an aura of mystery. They may appear emotionless and intimidating, using black as a protective barrier to hide vulnerabilities and insecurities. While black can symbolize strength and authority, it is also linked to negative aspects such as fear, sadness, and rebellion. Excessive use of black may indicate a desire to retreat and hide from the world, suppressing joy and pleasure.`,

    Green: `Green is the color of nature, symbolizing growth, balance, and renewal. It embodies harmony and stability, often associated with health, prosperity, and generosity. Individuals with a green personality are diplomatic, peaceful, and caring, striving to bring harmony to their communities. They are practical and down-to-earth, with a strong sense of loyalty and a desire to belong. However, they may also exhibit negative traits such as envy, materialism, and possessiveness. Green personalities value balance and peace, often focusing on the future and making mindful decisions. They are generous and caring but should be cautious not to neglect themselves while taking care of others. Their need to belong can sometimes lead to self-righteousness or jealousy if they feel unacknowledged.`,

    Orange: `Orange is a vibrant and energetic color associated with enthusiasm, adventure, and creativity. It embodies warmth and excitement, often linked to socialization and optimism. Individuals with an orange personality are typically extroverted, adventurous, and creative, thriving in dynamic environments and seeking new experiences. They are warm, good-natured, and their enthusiasm is contagious. However, they may also exhibit negative traits such as superficiality, impatience, and egoism. Orange personalities value social interaction and are often seen as the life of the party, but their need for excitement can sometimes lead to inconsistency and unpredictability.`,

    Pink: `Pink is a color that embodies love, compassion, and nurturing. It combines the passion and energy of red with the purity and innocence of white, resulting in a hue that is both gentle and affectionate. Pink is often associated with femininity, sweetness, and romance, evoking feelings of warmth and comfort. Individuals with a pink personality are typically loving, kind, and generous, often putting the needs of others before their own. They are approachable and have a charming, youthful demeanor that draws people in. However, they may also exhibit traits of immaturity and naivety, sometimes viewing the world through rose-colored glasses. Their desire for unconditional love and acceptance can lead to disappointment if not reciprocated. While their optimism and sensitivity are strengths, they should be mindful of becoming overly dependent on others for validation.`,

    Purple: `Purple is a rare and powerful color often associated with spirituality, imagination, royalty, and mystery. Becuase the color purple has always been rare in nature, purple things used to be considered royal. It combines the energy of red with the calmness of blue, creating a personality that is creative, sensitive, and wise. Purple personalities are charismatic, introverted, and visionary, often pursuing humanitarian causes and artistic passions. However, their emotional depth can lead to hypersensitivity, arrogance, or moodiness. The color also represents a longing for emotional stability, personal authenticity, and self-knowledge.

    People who favor purple tend to be unique, intuitive, and connected to spiritual growth, sometimes drawn to the mystical or occult. They may struggle with immaturity or feeling misunderstood due to their abstract thinking and idealism, yet they bring compassion and creativity to those around them.

    Additionally, purple is the combination between warm red and cool blue tones-- therefore, it retains properies of both colors. Purple is a secondary color that is complementary to yellow, according to the CMYK color model. On the other hand, it is complementary to green according to the RGB color model.`,

    Red: `Red is the color of passion, energy, and intensity. It is associated with love, anger, and danger, often used to evoke strong emotions. Individuals with a red personality are typically outgoing, assertive, and passionate, often seeking attention and excitement. They are warm, good-natured, and their enthusiasm is contagious. However, they may also exhibit negative traits such as impulsiveness, selfishness, and aggression. Red personalities value passion and intensity, often focusing on the present and making impulsive decisions. They are warm and good-natured but should be mindful of becoming too self-centered or aggressive.`,

    White: `White is the color of purity, innocence, and simplicity. It symbolizes clarity, honesty, and transparency, often associated with peace and harmony. Individuals with a white personality are typically optimistic, friendly, and open-minded, often seeking harmony and balance in their lives. They are warm, good-natured, and their enthusiasm is contagious. However, they may also exhibit negative traits such as naivety, gullibility, and superficiality. White personalities value harmony and balance, often focusing on the present and making mindful decisions. They are warm and good-natured but should be mindful of becoming too idealistic or naive.`
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Image 
        src={`/images/color-icons/${color.toLowerCase()}-icon.png`}
        alt={`${color} icon`}
        width={40}
        height={40}
      />
      <p className="text-sm">{descriptions[color]}</p>
    </div>
  );
};

const PersonalityCard = ({ person }) => {
  const dominantColor = person.suggested_color;
  
  return (
    <div 
      className="rounded-lg p-6 shadow-lg"
      style={{
        backgroundColor: `${colorMap[dominantColor]}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      
      {/* Add color description */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="font-semibold mb-2">Color Personality</h3>
        <ColorDescription color={dominantColor} />
      </div>
    </div>
  );
}; 