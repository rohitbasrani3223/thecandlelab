package com.thecandlelab.backend.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtil {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^\\w\\s-]");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final Pattern MULTIPLE_HYPHENS = Pattern.compile("-+");

    public static String generateSlug(String input) {
        if (input == null || input.isBlank()) return "";

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String ascii = normalized.replaceAll("[^\\p{ASCII}]", "");
        String lower = ascii.toLowerCase(Locale.ENGLISH);
        String noSpecial = NON_ALPHANUMERIC.matcher(lower).replaceAll("");
        String noWhitespace = WHITESPACE.matcher(noSpecial.trim()).replaceAll("-");
        String cleanSlug = MULTIPLE_HYPHENS.matcher(noWhitespace).replaceAll("-");

        return cleanSlug.replaceAll("^-+|-+$", "");
    }

    public static String generateUniqueSlug(String input, java.util.function.Predicate<String> existsCheck) {
        String baseSlug = generateSlug(input);
        String slug = baseSlug;
        int counter = 1;

        while (existsCheck.test(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }

    private SlugUtil() {}
}
