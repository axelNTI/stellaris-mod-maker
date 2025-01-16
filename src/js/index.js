$(async () => {
   const mods = await backend.getModDescriptorNames();

   const locale = await backend.getLocale("en");
   console.log(locale);

   mods.forEach(async (mod) => {
      const name = await backend.getModName(mod);
      const folder = await backend.getModFolder(mod);
      $("body").append(`<p>${name}</p>`);
      $("body").append("<button>Open</button>");
   });
});
