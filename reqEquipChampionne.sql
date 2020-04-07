SELECT Teams.teamID,
    Teams.teamID = WSC.teamIDWinner AS WS,
    Teams.teamID=LC.teamIDWinner AS NLCS,
    Teams.W,Teams.L
FROM Teams,
    (SELECT teamIDWinner
     FROM SeriesPost
     WHERE yearID=1979
            AND round='NLCS'
    ) AS LC,
    (SELECT teamIDWinner
     FROM SeriesPost
     WHERE yearID=1979
        AND round='WS') AS WSC
WHERE Teams.yearID=1979
    AND Teams.lgID='NL'
    AND Teams.divID='E'