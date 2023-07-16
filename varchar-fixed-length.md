# 배경
- Real mysql을 읽다 평소에 궁금하던 mysql에서 varchar를 어떻게 다루는지에 대한 설명이 간략히 있었다.
- 기본적으로 아래 설명과 같이 255byte 까지는 prefix data로 1byte, 이후는 2byte를 사용하는 것은 알고있었다. 잘못 이해하는 경우 문자열의 길이로 오해할 수 있는데, encoding에 의한 byte에 대한 내용이므로 1글자당 4byte를 사용하는 encoding인 경우 약 63글자 정도만 prefix로 1byte만 사용하는 것이다.
> In contrast to CHAR, VARCHAR values are stored as a 1-byte or 2-byte length prefix plus data. The length prefix indicates the number of bytes in the value. A column uses one length byte if values require no more than 255 bytes, two length bytes if values may require more than 255 bytes.

- 책에서는 한줄요약 급으로 설명하고 있어서, 실제 Engine layer에서는 어떻게 구현되어 있는지 궁금했다.

# 한 줄 요약
- Temp table을 활용하는 경우 Mysql 5.7까지는 char와 동일하게 fixed-length를 사용한다.

# 설명
- Mysql 5.7에서는 일부 작은 데이터를 위해 Temp table을 활용할 때, Memory DB를 활용한다.
- Memory DB는 varchar를 fixed-length로 활용한다.

# 구현 확인
- sql_tmp_table.cc 에서 create_virtual_tmp_table 메서드같은 것을 통해 temp table을 만든다. record length는 아래와 같은 로직으로 설정된다.
```
record_length+= (*field)->pack_length();
```
- pack_length 를 호출하는 것을 통해 record length를 구한다.
```
  /*
    pack_length() returns size (in bytes) used to store field data in memory
    (i.e. it returns the maximum size of the field in a row of the table,
    which is located in RAM).
  */
  virtual uint32 pack_length() const { return (uint32) field_length; }
```
- hp_write.c에서 아래 코드로 메모리 할당한 후 write한다.
```
memcpy(pos,record,(size_t) share->reclength);
```

# 추가로 알게된 것
- HA_KEYTYPE_VARTEXT1, HA_KEYTYPE_VARTEXT2는 Mysql source code내에서 prefix 길이를 구분하기 위한 enum이다.
- Memory DB에서는 HA_KEYTYPE_VARTEXT1 로 통일해서 활용한다.
- `share->db_low_byte_first=1;                // True for HEAP and MyISAM` 에 의해 temp table의 storage engine이 설정된다.
- key length도 더 많이 사용할 수 있다.
```
          /*
            For BTREE algorithm, key length, greater than or equal
            to 255, is packed on 3 bytes.
          */
```

# 결론
- Mysql8에서는 기본적으로 MemoryDB(heap)을 사용하지 않아서, 구현체가 다를 것이다.
- 어찌되었건 길이를 너무 늘려서 활용하는 것은 좋지 않다.

# Reference
- https://dev.mysql.com/doc/refman/5.7/en/char.html
- https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html
- https://dev.mysql.com/doc/refman/8.0/en/memory-storage-engine.html
