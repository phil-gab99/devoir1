-- Vincent Falardeau, Philippe Gabriel

-------------------------------------------------------------------------------

-- Requête 1:

SELECT ta.name AS équipe,
    ta.W/(ta.W + ta.L) AS moyenne,
    ta.W AS V,
    ta.L AS D,
    tb.W - ta.W AS diff
FROM Teams AS ta
    INNER JOIN
        (SELECT W, lgID, divID, yearID
            FROM Teams
            WHERE Rank = 1
        ) AS tb
        ON ta.lgID = tb.lgID
            AND ta.divID = tb.divID
            AND ta.yearID = tb.yearID
WHERE ta.lgID = 'NL'
    AND ta.divID = 'E'
    AND ta.yearID = 1996
ORDER BY V DESC;

-------------------------------------------------------------------------------

-- Requête 2:

SELECT m.nameLast AS nom,
    m.nameFirst AS prénom,
    p.G,
    p.W + p.SV,
    p.W,
    p.SV,
    p.L,
    p.SO,
    p.H,
    p.BB,
    p.IPouts,
    s.salary AS salaire
FROM Master AS m
    INNER JOIN Pitching AS p ON m.playerID = p.playerID
    INNER JOIN Salaries AS s ON m.playerID = s.playerID
WHERE p.yearID = 1996
    AND p.yearID = s.yearID
    AND p.teamID = 'MON'
    AND p.GS = 0
ORDER BY (p.W + p.SV) DESC;

-------------------------------------------------------------------------------

-- Requête 3:

SELECT m.nameLast AS nom,
    m.nameFirst AS prénom,
    p.ERA,
    p.GS,
    p.GF,
    p.W,
    p.L,
    p.CG,
    p.SO,
    p.H,
    p.BB,
    p.IPouts,
    s.salary AS salaire
FROM Master AS m
    INNER JOIN Pitching AS p ON m.playerID = p.playerID
    INNER JOIN Salaries AS s ON m.playerID = s.playerID
WHERE p.yearID = 1996
    AND p.yearID = s.yearID
    AND p.teamID = 'MON'
    AND p.GS > 0
ORDER BY p.GS DESC;

-------------------------------------------------------------------------------

-- Requête 4:

SELECT m.nameLast AS nom,
    m.nameFirst AS prénom,
    b.H/b.AB AS 'BA%',
    (b.H - b.2B - b.3B - b.HR + 2*b.2B + 3*b.3B + 4*b.HR)/b.AB AS 'SL%',
    (b.H + b.BB + b.HBP)/(b.AB + b.BB + b.HBP + b.SF) AS 'OB%',
    b.SO/b.AB AS 'SO%',
    b.SB/(b.CS+b.SB) AS 'SB%',
    b.AB,
    b.H,
    b.HR,
    b.BB,
    b.R,
    b.SB,
    b.CS,
    SUM(f.A)/(SUM(f.A) + SUM(f.E)) AS 'FP%',
    f2.POS AS 'POS*',
    SUM(f.A) AS A,
    SUM(f.E) AS E,
    s.salary AS salaire
FROM Master AS m
    INNER JOIN Fielding AS f ON m.playerID = f.playerID
    INNER JOIN Salaries AS s ON m.playerID = s.playerID
    INNER JOIN Batting AS b ON m.playerID = b.playerID
    INNER JOIN (SELECT playerID, yearID, teamID, POS, GS
                FROM Fielding
                ) AS f2 ON m.playerID = f2.playerID
WHERE f.yearID = 1996
    AND f.yearID = s.yearID
    AND f.yearID = b.yearID
    AND f.yearID = f2.yearID
    AND f.teamID = 'MON'
    AND f.teamID = b.teamID
    AND f.teamID = f2.teamID
    AND f.POS <> 'OF'
    AND f2.POS <> 'P'
    AND f2.POS <> 'OF'
    AND f2.GS = (SELECT MAX(GS)
                FROM Fielding
                WHERE f.playerID = playerID
                    AND f.yearID = yearID
                    AND f.teamID = teamID
                    AND POS <> 'P'
                    AND POS <> 'OF'
                )
    AND b.AB > 10
GROUP BY m.playerID;