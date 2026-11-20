package com.example.klausur.config;

import java.io.IOException;
import java.time.LocalDateTime;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class SecurityErrorWriter {

    private SecurityErrorWriter() {}

    public static void write(HttpServletRequest req, HttpServletResponse res,
                             int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        String json = "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"path\":\"%s\"}"
                .formatted(LocalDateTime.now(), status, escape(message), escape(req.getRequestURI()));
        res.getWriter().write(json);
    }

    private static String escape(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}