import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDB {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";
        String user = "postgres.nffwpckgcrwaljmpxcef";
        String password = "Prajubhai143";
        try {
            System.out.println("Connecting to Supabase...");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Success! Connected to Supabase database.");
            conn.close();
        } catch (SQLException e) {
            System.out.println("Connection Failed!");
            e.printStackTrace();
        }
    }
}








