export default function Features() {

  const features = [

    {
      title: "Verified Hospitals",
      desc: "Only verified hospitals can raise emergency blood requests."
    },

    {
      title: "Instant Alerts",
      desc: "Nearby donors receive SMS & WhatsApp notifications instantly."
    },

    {
      title: "Smart Matching",
      desc: "Matches donors based on blood group, eligibility and distance."
    }

  ];

  return (

    <section className="py-20 bg-white">

      <h2 className="text-4xl text-center font-bold mb-12">

        Why RaktSetu?

      </h2>

      <div className="grid md:grid-cols-3 gap-8 px-16">

        {features.map((feature, index) => (

          <div
            key={index}
            className="shadow-lg rounded-xl p-8 hover:shadow-2xl transition"
          >

            <h3 className="text-2xl font-bold mb-4">

              {feature.title}

            </h3>

            <p className="text-gray-600">

              {feature.desc}

            </p>

          </div>

        ))}

      </div>

    </section>

  );
}