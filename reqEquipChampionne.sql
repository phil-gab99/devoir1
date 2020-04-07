-- SELECT Teams.teamID,
--     Teams.teamID = WSC.teamIDWinner AS WS,
--     Teams.teamID=LC.teamIDWinner AS NLCS,
--     Teams.W,Teams.L
-- FROM Teams,
--     (SELECT teamIDWinner
--      FROM SeriesPost
--      WHERE yearID=1979
--             AND round='NLCS'
--     ) AS LC,
--     (SELECT teamIDWinner
--      FROM SeriesPost
--      WHERE yearID=1979
--         AND round='WS') AS WSC
-- WHERE Teams.yearID=1979
--     AND Teams.lgID='NL'
--     AND Teams.divID='E'

SELECT ta.name AS équipe,
    ta.teamID,
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