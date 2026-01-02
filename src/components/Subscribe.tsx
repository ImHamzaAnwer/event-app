export default function Subscribe() {
  return (
    <section className="flex flex-col justify-between px-10 py-10 min-h-[120vh] bg-black bg-[url('https://images.unsplash.com/photo-1550026593-bdab027adb6a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-center">
      <p className="text-5xl md:text-6xl text-white font-bold text-right">
        Arts Council. The STAGE to set untold amazing stories.
      </p>

      <div>
        <p className="text-white font-bold text-2xl">Join & Support</p>

        <p className="font-semibold text-white max-w-md">
          You give to the power of truth-telling through art and to the uplift
          of our community—perhaps more important now than ever before.
        </p>

        <form className="flex gap-2 items-center mt-10">
          <input
            required
            type="email"
            placeholder="Your email address"
            className="p-1.5 bg-white rounded-sm min-w-60"
          />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
