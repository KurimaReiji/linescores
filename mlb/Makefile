APRIL := $(wildcard 2018/daily/2018-03-??.json 2018/daily/2018-04-??.json)
MAY := $(wildcard 2018/daily/2018-05-??.json)
JULE := $(wildcard 2018/daily/2018-06-??.json)
JULY := $(wildcard 2018/daily/2018-07-??.json)

merged.json: 2018/2018-04.json 2018/2018-05.json 2018/2018-06.json 2018/2018-07.json
	jq -s '.|add' 2018/2018-??.json > merged.json

2018/2018-07.json: $(JULY)
	jq -s '.|add' 2018/daily/2018-07-??.json > 2018/2018-07.json

2018/2018-06.json: $(JULE)
	jq -s '.|add' 2018/daily/2018-06-??.json > 2018/2018-06.json

2018/2018-05.json: $(MAY)
	jq -s '.|add' 2018/daily/2018-05-??.json > 2018/2018-05.json

2018/2018-04.json: $(APRIL)
	jq -s '.|add' 2018/daily/2018-03-??.json 2018/daily/2018-04-??.json > 2018/2018-04.json