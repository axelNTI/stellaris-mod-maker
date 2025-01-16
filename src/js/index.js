$(async () => {
   $("#newMod").on("click", async () => {
      window.location.replace("./new.html");
   });

   const mods = await backend.getModDescriptorNames();
   const languageCode = $("#data").data("language");
   const locale = await backend.getLocale(languageCode);

   mods.forEach(async (mod) => {
      const name = await backend.getModName(mod);

      const section = $("<section></section>");
      section.append(`<p>${name}</p>`);
      section.append(`<button>${locale.load_mod}</button>`);
      $("#mods").append(section);
   });
});
