module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("products.json");
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("admin");

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
