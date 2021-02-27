# Some copy-pasted code that I modified
# It's only meant to be used by me so I'm not going to bother with making it handle all sorts of cases
# {% code lang:Bash hlLines:'1' showLnNo:true %}
#  echo Hello World
# {% endcode %}

module Jekyll
    class CodeBlockTag < Liquid::Block
  
      def initialize(tag_name, markup, tokens)
        super
        @markup = markup
      end
  
      def render(context)
        # Gather settings
        site = context.registers[:site]
        converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

        # Render any liquid variables
        markup = Liquid::Template.parse(@markup).render(context)

        # Extract tag attributes
        attributes = {}
        markup.scan(Liquid::TagAttributes) do |key, value|
          attributes[key] = value
        end

        @language = attributes["lang"]
        @showLines = attributes["showLnNo"]
        @hlLines = attributes["hlLines"]
        @hlLinesArray = attributes["hlLines"] ? attributes["hlLines"].gsub(/['"]/,"").split(",") : []
        @hlRange = attributes["hlRange"]
        @hlRangeArray = attributes["hlRange"] ? attributes["hlRange"].gsub(/['"]/,"").split("-") : []
        @class = ""
        if @language
          @class += " language-#{@language} "
        end

        puts "@showLines #{@showLines}"
        if @showLines.nil?
          puts 'here'
          @class += " nohljsln "
        end

        if @class
          code_tag = "<code class\=\"#{@class}\">"
        else
          code_tag = "<code>"
        end

        # Code content
        formatted_content = ""
        content = converter.convert(super(context)).gsub(/<\/?p[^>]*>/, "").gsub(/“/,"\"").gsub(/”/,"\"").strip
        content.each_line.with_index do |line, index|
          lnNo = "#{index+1}"
          new_line = line
          if (@hlLines && @hlLinesArray.include?(lnNo)) || (@hlRange && @hlRangeArray[0].to_i <= lnNo.to_i && @hlRangeArray[1].to_i >= lnNo.to_i)
            puts "highlight line #{lnNo}"
            new_line = "<span class=\"hl-line\">#{line}</span>"
          end
          formatted_content += new_line
        end
        puts  "<pre>#{code_tag}#{formatted_content}</code></pre>"
        code = "<pre>#{code_tag}#{formatted_content}</code></pre>"
      end
    end
  end
  
  Liquid::Template.register_tag('code', Jekyll::CodeBlockTag)