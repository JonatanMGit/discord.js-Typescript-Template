const DisToken = "";

if (!DisToken) {
  console.error("DisToken is not set");
  process.exit(1);
}

export = {
  DisToken: process.env.DisToken || DisToken,
};
