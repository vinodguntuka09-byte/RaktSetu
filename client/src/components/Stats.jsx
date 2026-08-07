export default function Stats() {

  return (

    <section className="py-20 bg-red-600 text-white">

      <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-10">

        <div>
          <h1 className="text-5xl font-bold">100+</h1>
          <p>Hospitals</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">5000+</h1>
          <p>Donors</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">1200+</h1>
          <p>Requests</p>
        </div>

        <div>
          <h1 className="text-5xl font-bold">98%</h1>
          <p>Success Rate</p>
        </div>

      </div>

    </section>

  );

}