module.exports = function (eleventyConfig) {
  // Tell Eleventy to copy these files/folders to the output without processing
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy({ "product/media": "static/product/media" });
 // your images folder

  eleventyConfig.addCollection("products", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./product/*.md");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
