package grafl.sy.logic;


import java.io.File;
import java.io.FileInputStream;


import org.junit.Test; 
import static org.junit.Assert.*; 

public class AllLevelTest 
{	
	@Test
	public void testTutorial1() throws Exception
	{
		testLevels("tutorial1");
	}

	@Test
	public void testTutorial2() throws Exception
	{
		testLevels("tutorial2");
	}
	
	@Test
	public void testTutorial3() throws Exception
	{
		testLevels("tutorial3");
	}

	@Test
	public void testTutorial4() throws Exception
	{
		testLevels("tutorial4");
	}

	@Test
	public void testTutorial5() throws Exception
	{
		testLevels("tutorial5");
	}

	@Test
	public void testAdvanced1() throws Exception
	{
		testLevels("advanced1");
	}

	@Test
	public void testAdvanced2() throws Exception
	{
		testLevels("advanced2");
	}

	@Test
	public void testAdvanced3() throws Exception
	{
		testLevels("advanced3");
	}
	
	@Test
	public void testMission() throws Exception
	{
		testLevels("mission");
	}

	@Test
	public void testExtended1() throws Exception
	{
		testLevels("extended1");
	}

	@Test
	public void testExtended2() throws Exception
	{
		testLevels("extended2");
	}

	@Test
	public void testExtended3() throws Exception
	{
		testLevels("extended3");
	}
	
	@Test
	public void testExtended4() throws Exception
	{
		testLevels("extended4");
	}

	@Test
	public void testExtended5() throws Exception
	{
		testLevels("extended5");
	}

	@Test
	public void testExtended6() throws Exception
	{
		testLevels("extended6");
	}

	@Test
	public void testExtended7() throws Exception
	{
		testLevels("extended7");
	}

	@Test
	public void testTwoPlayer() throws Exception
	{
		testLevels("twoplayer");
	}
		
	public void testLevels(String name) throws Exception
	{
		testLevels(new File("c:/users/reinhard/documents/github/sapphireyours/sapphireyours_common/res/levels/"+name+".sylev"));
	}
	public void testLevels(File file) throws Exception
	{
		if (file.isFile())
		{	String p = file.getAbsolutePath();
			if (p.endsWith(".sylev"))
			{	FileInputStream is = new FileInputStream(p);
				LevelPack lp = new LevelPack(file.getName(), is, false, "unnamed");
				is.close();	
				System.out.println("pack "+file+" contains "+(lp.levels.length)+" levels");
//				for (Level l:lp.levels)
//				{	testLevel(l);
//				}
				for (int i=0; i<lp.levels.length; i++)
				{	testLevel(lp.levels[i]);
				}			
			}
		}
		else if (file.isDirectory())
		{	File[] children = file.listFiles();
			for (int i=0; i<children.length; i++)
			{	testLevels(children[i]);			
			}
		}
	}
	
	private void testLevel(Level le)
	{
		assertFalse("Dispensers are not supported: "+le.getTitle(),  le.containsPiece((byte)'d'));
		assertFalse("Wheels are not supported: "+le.getTitle(), le.containsPiece((byte)'w'));
		assertFalse("Revolving doors are not supported: "+le.getTitle(), le.containsPiece((byte)'-'));
		assertFalse("Dark walls are not supported: "+le.getTitle(), le.containsPiece((byte)'i'));
		assertTrue("Game must have a author: "+le.getTitle(), le.getAuthor()!=null && le.getAuthor().trim().length()>0);

		Logic lo = new Logic(100000);
		
		System.out.println("Testing level "+le.getTitle()+"...");
		assertTrue(le.demos.length>0);


		for (int i=0; i<le.demos.length; i++)
		{	Walk w = le.demos[i];
			lo.attach(le, w);
			
			System.out.println("  demo "+i+"...");
			
			lo.gototurn(0);
			assertFalse(lo.isSolved());
				
			for (int j=0; j<=w.getTurns(); j++)	
			{	lo.gototurn(j);
				if (lo.isKilled())
				{ 
					System.out.println("Player was killed!");
					for (int k=j-30; k<j+1; k++)
					{	lo.gototurn(k);
						lo.printDump();
					}
					assertTrue(false);
				}
			}

			if (!lo.isSolved())
			{
				System.out.println("Walkthrough does not work!");
//				le.print(System.out);				
//				for (int k=w.getTurns()-30; k<=w.getTurns(); k++)
//				{	lo.gototurn(k);
//					lo.printDump();
//				}
				System.out.println("Need "+lo.getNumberOfEmeraldsStillNeeded()+" more emeralds");

				assertTrue(false);
			}
			
			int time = lo.totalTimeForSolution();
			if (w.getTurns() > time+10)
			{	System.out.println("Walkthrough has too much extra waits appended");
				assertTrue(false);
			}
			else if (w.getTurns() < time+5)
			{	System.out.println("Walkthrough has too few extra waits appended");
				assertTrue(false);
			}
			else if (lo.getNumberOfEmeraldsStillNeeded()<0)
			{	System.out.println("Collected too many emeralds: "+(-lo.getNumberOfEmeraldsStillNeeded()));
//				assertTrue(false);
			}
			
			
//			System.out.println("done");
			
//			for (int turn=t-40; turn<t+1; turn++)
//			{	lo.gototurn(turn);
//				lo.printDump();
//			}

//			System.out.println("Running demo reverse:");
//
//			for (int turn=w.getTurns()-1; turn>=0; turn--)
//			{	lo.gototurn(turn);
//				lo.printDump();
//			}
		}
	}
}
