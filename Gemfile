source "https://rubygems.org"

gem "jekyll", "~> 3.8.6"
gem "jekyll-seo-tag"
gem "json"
gem "hash-joiner"
gem 'html-proofer'
gem 'jemoji'
gem "mini_magick"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.6"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?
