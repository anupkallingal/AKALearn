package com.aka.learn.mongodb;

import spark.Spark;

public class SparkRoutes {
    public static void main(String[] args) {
        Spark.get("/", (req, res) -> "Hello World From Spark");

        Spark.get("/test", (req, res) -> "This is a test page");

        Spark.get("/echo/:thing", (req, res) -> req.params(":thing"));
    }
}
