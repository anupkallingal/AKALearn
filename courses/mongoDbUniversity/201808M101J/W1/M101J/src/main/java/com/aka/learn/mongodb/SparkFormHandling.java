package com.aka.learn.mongodb;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import spark.Spark;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class SparkFormHandling {
    public static void main(String[] args) {
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_20);
        configuration.setClassForTemplateLoading(HelloWorldSparkFreemarkerStyle.class, "/");

        Spark.get("/", (req, res) -> {
            StringWriter writer = new StringWriter();
            try {
                Map<String, Object> map = new HashMap<>();
                map.put("fruits", Arrays.asList("apple", "orange", "banana", "peach"));

                Template template = configuration.getTemplate("fruitPicker.ftl");
                template.process(map, writer);
            } catch (IOException | TemplateException e) {
                Spark.halt(500);
                e.printStackTrace();
            }
            return writer;
        });

        Spark.post("/favorite_fruit", (req, res) -> {
            final String fruit = req.queryParams("fruit");
            if (fruit == null) {
                return "Why dont you pick one?";
            } else {
                return "Your favourite fruit is " + fruit;
            }
        });
    }
}
