class DecodeService{
    static async decodingEntities(string) {
        const str = string
        .replace(/&#8211;/g, '-')
        .replace(/&#8217;/g, '`')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#9989;/g, " ")
        .replace(/&quot/g, '"')
        .replace(/&lt/g, "<")
        .replace(/&gt/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp/g, " ")
        .replace(/&#160;/g, " ")
        .replace(/&iquest;/g, ";")
        .replace(/&apos;/g, "'")
        .replace(/&#8212/g, "_")
        .replace(/&#37;/g, "%")
        .replace(/&#35;/g, "#")
        .replace(/&#40;/g, "(")
        .replace(/&#41;/g, ")")
        .replace(/&#47;/g, "/")
        .replace(/&#58;/g, ":")
        .replace(/&#59;/g, ";")
        .replace(/&#61;/g, "=")
        .replace(/&#91;/g, "[")
        .replace(/&#92;/g, "'\'")
        .replace(/&#93;/g, "]")
        .replace(/&#95;/g, "_")
        .replace(/&#96;/g, "`")
        .replace(/&#123;/g, "{")
        .replace(/&#124;/g, "|")
        .replace(/&#125;/g, "}")
        .replace(/&#126;/g, "~")
        .replace(/&raquo;/g, "»")
        return str
    }
}
module.exports = DecodeService