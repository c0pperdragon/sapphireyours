package grafl.sy.logic;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;

import org.junit.Test; 

public class LevelIOTest 
{
	@Test
	public void testLoadingAndWriting() throws IOException
	{
		InputStream is = new FileInputStream("c:/users/reinhard/google drive/workspace/sapphireyours/res/levels/welcome.sylev");
		// " getClass().getResourceAsStream("levels/welcome.sylev");
		Level l = new Level(is);
		is.close();
		
		System.out.println("After parsing: (ü)");
		l.print(System.out);

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		l.print( new PrintStream(bos, true, "utf-8"));		
		
		Level l2 = new Level(new ByteArrayInputStream(bos.toByteArray()));
		
		System.out.println("After parsing the written data:");
		l2.print(System.out);
	}

	@Test
	public void testLoadingBig() throws IOException
	{
		InputStream is = new FileInputStream("c:/users/reinhard/google drive/workspace/sapphireyours/res/levels/bdrome.sylev");
		// " getClass().getResourceAsStream("levels/welcome.sylev");
		Level l = new Level(is);
		is.close();
		
		l.print(System.out);
	}
	
}
