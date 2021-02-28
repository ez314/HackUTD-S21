export default function Dashboard({user}) {
    console.log(user);
    if (!user) {
        return (
            <p>Not logged in!</p>
        )
    }
  return (
    <div className="mx-auto text-center mt-4">
      <img
        className="mx-auto align-self-center rounded-full"
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=512`}
      />
      <h1 className="text-3xl mt-4">
        Hello, {user.username}#{user.discriminator}!
      </h1>
    </div>
  );
}
