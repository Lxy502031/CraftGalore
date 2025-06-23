module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("products.json");
  eleventyConfig.addPassthroughCopy("static"); // ✅ This copies all static assets including images

  // Product collection
  eleventyConfig.addCollection("products", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/product/*.md");
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
