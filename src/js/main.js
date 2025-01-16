$(async () => {
   const mods = await backend.getModDescriptorNames();

   mods.forEach(async (mod) => {
      const name = await backend.getModName(mod);
      const folder = await backend.getModFolder(mod);
      $("body").append(`<p>${name}</p>`);
      $("body").append("<button>Open</button>");
   });
});
