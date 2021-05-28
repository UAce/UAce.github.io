source "https://rubygems.org"

gem "jekyll", "~> 3.8.6"
gem "json"
gem "hash-joiner"
gem "html-proofer"
gem "jemoji"
gem "mini_magick"
gem "bootstrap", "~> 4.4.1"
gem "concurrent-ruby", "~> 1.1.6"
gem "execjs", "~> 2.7.0"
gem "bundler", "~> 2.2.16"

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-autoprefixer"
  gem "jekyll-feed", "~> 0.6"
  gem "jekyll-compose"
  gem "jekyll-minifier"

end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?

